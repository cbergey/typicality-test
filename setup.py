#!/usr/bin/env python

import os
import sys

from setuptools import setup, find_packages


if sys.argv[-1] == 'publish':
    os.system('python setup.py sdist upload')
    sys.exit()

try:
    import pypandoc
    readme = pypandoc.convert('README.md', 'rst')
    history = pypandoc.convert('CHANGELOG.md', 'rst')
except (IOError, ImportError):
    readme = open('README.md').read()
    history = open('CHANGELOG.md').read()

# Get rid of Sphinx markup
history = history.replace('.. :changelog:', '')

setup_args = dict(
    name='callab.typicality_judgments',
    version='0.1.0',
    description='An experiment that elicits typicality judgments about noun-adjective pairs.',
    long_description=readme + '\n\n' + history,
    author='Claire Bergey',
    author_email='cbergey@uchicago.edu',
    url='https://github.com/cbergey/typicality-test',
    packages=find_packages('.'),
    package_dir={'': '.'},
    namespace_packages=['callab'],
    include_package_data=True,
    install_requires=[
        'setuptools',
    ],
    license='MIT',
    zip_safe=False,
    keywords='Dallinger typicality_judgments',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Programming Language :: Python :: 2.7',
    ],
    entry_points={
        'dallinger.experiments': [
            'typicalityjudgments = callab.typicality_judgments.experiment:typicalityjudgments',
        ],
    },
)

setup(**setup_args)
