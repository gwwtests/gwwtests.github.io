#!/bin/bash

#Assumption "$1"  is path to output .wav file
#rec -r 16000 -c 1 -d "$1"
#arecord -l # to get hw:X,Y
#arecord -D hw:X,Y -f S16_LE -c1 -r16 -t wav "$1"

set -x
# let's try without -D hw:X,Y
arecord -f S16_LE -c1 -r16 -t wav "$1"
