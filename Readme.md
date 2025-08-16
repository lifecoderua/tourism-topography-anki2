Sourced from an open source Anki set from the depth of internet.


- `media_source/` - contains the source of signs
- `media_destination/` - output folder for renamed/copied images
- `collection.anki2` - SQlite in disguise
- `media` - JSON mapping ID filename to the original filename from the image source

## Installation

```sh
npm install
```

## Usage

```sh
npm start
# or
node src/app.js
```

This will copy images from `media_source/` to `media_destination/`, preserving the file name (ID) and setting the extension based on the `media_source/media` JSON catalogue.

