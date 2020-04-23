#!/usr/bin/env python3
import io
import os
from glob import glob
from os.path import basename
from os.path import splitext

from setuptools import find_packages
from setuptools import setup

setup(
    name="contextlog",
    version="0.1",
    description="Context logger",
    packages=find_packages("src"),
    package_dir={"": "src"},
    py_modules=[splitext(basename(path))[0] for path in glob("src/contextlog/*.py")],
    include_package_data=True,
    zip_safe=False,
    python_requires=">=3.7",
)