#!/bin/bash

# This script converts images and PDFs in the public/certs directory to WebP format.
# On macos, install dependencies with: brew install webp imagemagick

find ./public/certs -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.pdf" \) -print0 | while IFS= read -r -d '' file; do
  output_file="${file%.*}.webp"
  if [[ ! -f "$output_file" ]]; then
    if [[ "$file" == *.pdf ]]; then
      magick -density 300 "$file" -quality 85 -resize 1200x\> -background white -alpha remove "$output_file"
    else
      cwebp -q 80 "$file" -o "$output_file"
    fi
    echo "Converted: $file → $output_file"
  fi
done
