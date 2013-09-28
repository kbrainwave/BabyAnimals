# BabyAnimals

BabyAnimals is a simple image service for your app. Upload, process, and fetch images easily using a RESTful API. 

BabyAnimals service can resize, blur, and filter images. The service is built over ImageMagick and express.js for image processing, and Amazon S3 as the image storage platform.

## Features:

* Image Uploading
* Image Deletion
* Image Fetching
* Image Resizing
* Obtaining image information
* Image Transforming:
  * blur
  * bw
  * sepia
  * nashville
  * auroral 
  * enhance
  * lomo
  * gotham
  * bw_gradient
  * vintage
* S3, for reliable image uploading
* Enivornment Configuration

## Installation

* Fork and clone this repository
* Install dependencies:

```js
npm install
```

* Install Imagemagick CLI tools. If you're on OSX, you can use Homebrew:

```js
brew install imagemagick
```
## Resource URL Patterns


### Image Uploading

Uploads the requested image to the configured s3 bucket. The request may be a path or a URL. The response is a JSON with a unique id that can be used to GET and transform the image, as well as access the image in s3 (the id is the s3 key).

**Syntax:**

```js
POST /babyanimals/upload?src={{image}}
```

**Example Request:**
```js
curl -X POST http://localhost:3000/babyanimals/upload?src=cute/baby/animal.png

or 

curl -X POST http://localhost:3000/babyanimals/upload?src=http://cutebabyanimal.png
```

**Example Response:** 
````js
{"id":"b21f37508f1c"}
````

### Image Fetching

Fetches the requested image from s3.

**Syntax:**

```js
GET /babyanimals/{{id}}
```

**Example Request:**

```js
curl -X GET http://localhost:3000/babyanimals/b21f37508f1c
```

![baby rhino](http://babyanimals.herokuapp.com/babyanimals/a6e5a7983949/)

### Image Resizing

Resizes the image to the dimensions that are specified by the URL query. The accepted dimensions are pixels (not percent). The dimensions default to the original images width and height, so if only one query is provided the default value will be utilized when maintaining the aspect ratio. At least one of width and height are required.

**Syntax:**
```js
GET /babyanimals/{{id}}/size?w={{width}}&h={{height}}
```
**Example Request:**

```js
curl -X GET http://localhost:3000/babyanimals/b21f37508f1c/size?w=150&h=200
```

**Original Image:**

![baby penguin](http://babyanimals.herokuapp.com/babyanimals/cb428c822347/size?w=400)

**Resized Image:**

![baby penguin](http://babyanimals.herokuapp.com/babyanimals/cb428c822347/size?w=150&h=200)

### Obtaining Infomation About an Uploaded Image

Returns the S3 URL pointing to the image, as well as metadata about the image itself. This request only works for images that have already been uploaded to S3.

**Syntax**
```js
GET /babyanimals/{{id}}/info
```

**Example Request:**
```js
curl -X GET http://localhost:3000/b21f37508f1c/info
```

**Example Response:**
```js
{
 "id": "39f2d22e6967",
 "bucket": "babyanimals",
 "url": "/babyanimals/39f2d22e6967",
 "width": 500,
 "height": 335,
 "filesize": 3.97266kb,
 "format: "PNG" 
}
```

### Image Filtering

Apply the filter that is specified by the URL query to the requested image. Because I like large land animals a lot

**Syntax**
```js
GET /id/:filter {{pic}}
```
**Example Request:**
```js
curl -X GET http://localhost:3000/b21f37508f1c/vintage
```

**Original Image**

![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c)

**Sepia**

![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/sepia)

**Nashville**

![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/nashville)

**auroral**

![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/auroral)

**enhance**

![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/enhance)

**lomo**

<!-- ![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/lomo) -->

**gotham**

<!-- ![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/gotham)
 -->
**bw_gradient**

<!-- ![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/bw_gradient)
 -->
**vintage**

<!-- ![baby elephant](http://babyanimals.herokuapp.com/babyanimals/f1a80b583b7c/vintage)
 -->
## HTTP status code summary

* **200 OK** GET Request went smoothly :)
* **201 Created** POST Request went smoothly :) 
* **204 No Content** Request went smoothly, and the server does not respond with a body 
* **400 Bad Request** Missing required query parameter
* **404 Not Found** The the requested image does not exist 

## how to deploy

define these environment vars:
  - AWS_ACCESS_KEY
  - AWS_SECRET_KEY
  - AWS_BUCKET
  - mongoose


built using
------
