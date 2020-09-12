# 1. Prerequisites
Follow the instructions on Digital Ocean on how to quick-start with your cluster. In a nutshell you need to:
1. Install **docker** on your local machine
2. Install **helm** on your local machine
3. install **kubectl** on your local machine
4. Create keys to access your cluster

# 2. Create the docker images to have in hand
```sh
docker build -t findsources/frontend:latest --file react/apps/frontend/Dockerfile .
docker push findsources/frontend
```

# 3. Add Helm repositories to your local machine
#### Add google official helm repo to install nginx
```sh
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
```
####  Add bitnami helm repo for mongodb
```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
```
####  Add jetstack helm repo which hosts the Cert-Manager chart
```sh
helm repo add jetstack https://charts.jetstack.io
```

# 4. Create secrets
Secrets need to be base64 encoded (echo -n "my_password" | base64)
####  Create a secret containing the docker hub key
```sh
kubectl create secret generic regcred --from-file=.dockerconfigjson=~/.docker/config.json --type=kubernetes.io/dockerconfigjson
```
####  Create producer secrets
```sh
kubectl create -f deployments/producer-secrets.yaml
```
####  Create consumer secrets
```sh
kubectl create -f deployments/consumer-secrets.yaml
```
####  Create admin secrets
```sh
kubectl create -f deployments/admin-secrets.yaml
```
####  Create mongo secrets
```sh
kubectl create -f deployments/mongo-secrets.yaml
```
####  Create monstache secrets
```sh
kubectl create -f deployments/monstache-secrets.yaml
```
####  View the encoded secrets
```sh
kubectl get secret producer-secrets -o yaml
```

# 5. Install nginx
```sh
helm install nginx-ingress stable/nginx-ingress --set controller.publishService.enabled=true
```
Check nginx configuration
```sh
kubectl exec <nginx-ingress-controller pod> cat /etc/nginx/nginx.conf
```
#### Manually apply CRDs from jetstack repo
```sh
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.1/cert-manager.crds.yaml
```
#### Create cert manager namespace
```sh
kubectl create namespace cert-manager
```
#### Install Cert-Manager for HTTPS access
```sh
helm install cert-manager --version v0.14.1 --namespace cert-manager jetstack/cert-manager
```
#### Create an Issuer to issue TLS certificates
```sh
kubectl create -f deployments/production_issuer.yaml
```

# 6. Create mongo replicaset via helm
```sh
helm install replica-set -f deployments/mongo-values.yaml bitnami/mongodb
```
Once the mongos are up, create mongo indexes on the collections
```sh
export DB_PASSWORD=`kubectl get secret producer-secrets --template={{.data.db_password}} | base64 --decode`
export DB_USERNAME=`kubectl get secret producer-secrets --template={{.data.db_username}} | base64 --decode`
export DB_NAME=`kubectl get secret producer-secrets --template={{.data.db_name}} | base64 --decode`

kubectl exec replica-set-mongodb-primary-0 mongo -- $DB_NAME -u $DB_USERNAME -p $DB_PASSWORD --eval "db.getCollection('referencemanager').createIndex({'title': 1})"
kubectl exec replica-set-mongodb-primary-0 mongo -- $DB_NAME -u $DB_USERNAME -p $DB_PASSWORD --eval "db.getCollection('referencemanager').createIndex({'reference_id': 1})"
kubectl exec replica-set-mongodb-primary-0 mongo -- $DB_NAME -u $DB_USERNAME -p $DB_PASSWORD --eval "db.getCollection('referencemanager').createIndex({'metadata.author_id': 1})"

kubectl exec replica-set-mongodb-primary-0 mongo -- $DB_NAME -u $DB_USERNAME -p $DB_PASSWORD --eval "db.getCollection('users').createIndex({'internal_sub_id': 1})"
kubectl exec replica-set-mongodb-primary-0 mongo -- $DB_NAME -u $DB_USERNAME -p $DB_PASSWORD --eval "db.getCollection('users').createIndex({'external_sub_id': 1})"
```
#### Port forward
```sh
kubectl port-forward replica-set-mongodb-primary-0 27017:27017
```

# 7. Create the elasticsearch replica
```sh
kubectl create -f deployments/elasticsearch.yaml
```
#### Port forward to the cluster
```sh
kubectl port-forward es-cluster-0 9200:9200
```	
#### Insert the index template
```sh
curl -X PUT -H 'Content-Type: application/json' -d @elasticsearch/referencemanager_template.json http://localhost:9200/_template/referencemanager_template
```
#### Insert the indexs
```sh
curl -X PUT http://localhost:9200/referencemanager.referencemanager
```
#### Confirm the elastic search cluster is ok
```sh
curl http://localhost:9200/_cluster/state?pretty
```

# 8. Create monstache
```sh
kubectl create -f deployments/monstache.yaml
```

# 9. Create consumer
```sh
kubectl create -f deployments/consumer.yaml
```

# 10. Create producer
```sh
kubectl create -f deployments/producer.yaml
```

# 11.Create admin
```sh
kubectl create -f deployments/admin.yaml
```

# 12. Create frontend
```sh
kubectl create -f deployments/frontend.yaml
```

# 13. Create admin-frontend
```sh
kubectl create -f deployments/admin-frontend.yaml
```
Run  admin/encrypt.py script to generate a hashed password for the admin user.
```
pipenv run python admin/encrypt.py
```
Create a new collection in mongo with the name "operators" and manually add the user details you just created
```
{
    "username" : "test@gmail.com",
    "password" : "hashed-password"
}
```
Port forward to the admin-frontend application
```
export ADMIN_POD=`kubectl get pods -l app=admin-frontend | awk 'FNR == 2 {print}' | awk '{print $1}'` && kubectl port-forward $ADMIN_POD 3000:3000
```

# 14. Create admin-frontend
```sh
kubectl create -f deployments/admin-frontend.yaml
```

# 15. Create the ingresses to expose the apps and establish the redirects
```sh
kubectl create -f deployments/ingress.yaml
```
Need to wait a bit. Track the progress of Let's Encrypt
```sh
kubectl describe certificate findsources-kubernetes-tls
```
Check that all the certificates have been created (findsources-kubernetes-tls, vrespiges-kubernetes-tls, www-findsources-kubernetes-tls, www-vrespiges-kubernetes-tls) and make sure the following permanent redirects works properly with the certificates:
1. http://findsources.co.uk -> https://findsources.co.uk
2. https://www.findsources.co.uk -> https://findsources.co.uk
3. http://www.findsources.co.uk -> https://findsources.co.uk
4. http://vrespiges.gr -> https://findsources.co.uk
5. https://vrespiges.gr -> https://findsources.co.uk
6. http://www.vrespiges.gr -> https://findsources.co.uk
7. https://www.vrespiges.gr -> https://findsources.co.uk

# 16. Backup mongo with volume snapshots
You can achieve the same from the Digital Ocean UI but be careful to use the correct names for the snapshots.

Delete the existing snapshot (we always keep the latest snapshot in the Digital Ocean account)
```sh
kubectl delete volumesnapshot mongo-primary-snapshot
```
Change the name (appending the new date) in backup-mongo.yaml
```sh
kubectl create -f deployments/backup-mongo.yaml
```
Check snapshot has been created
```sh
kubectl get volumesnapshot
```

# 17. Restore mongo volume from snapshot
This will require some short downtime as we need to take down the producer and mongo.
The rest of the apps (including monstache) will not be affected if mongo is down.

First take the producer down
```sh
kubectl delete -f deployments/producer.yaml
```
Then uninstall mongo
```sh
helm uninstall replica-set
```
Delete the existing volumes
```sh
kubectl get pvc
kubectl delete pvc datadir-replica-set-mongodb-primary-0 datadir-replica-set-mongodb-secondary-0
```
The restore the volumes (only primary is enough) from the snapshot.
Change the name of the snapshot to the one you want to use (date) in restore-mongo.yaml
```sh
kubectl create -f deployments/restore-mongo.yaml
```
Start mongo again
```sh
helm install replica-set -f deployments/mongo-values.yaml bitnami/mongodb
```
Start the producer
```sh
kubectl create -f deployments/producer.yaml
```

# Other
#### Restart a deployment after updates
```sh
kubectl rollout restart deployment/frontend
```

#### List helm releases
```sh
helm list
```

#### Certificates
If for some reason the ingress controller is destroyed, the certificates will need to be re-created when the new controller pod is up.

Do not forget to delete them
```sh
kubectl get certificates
kubectl delete certificate <cert-name>
```
Then create again ingress-controller + cert-manager + ingresses
