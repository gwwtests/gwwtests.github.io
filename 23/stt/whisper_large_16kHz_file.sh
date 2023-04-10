#!/bin/bash


# -otxt,     --output-txt        [false  ] output result in a text file
# -ovtt,     --output-vtt        [false  ] output result in a vtt file
# -osrt,     --output-srt        [false  ] output result in a srt file
# -owts,     --output-words      [false  ] output script for generating karaoke video
# -ocsv,     --output-csv        [false  ] output result in a CSV file

set -x
#time whisper.cpp-large -otxt="$1".txt -ovtt="$1".vtt -osrt="$1".srt -owts="$1".wts -ocsv="$1".csv  "$1"
time whisper.cpp-large -otxt -ovtt -osrt -ocsv -ml 1 "$@"
