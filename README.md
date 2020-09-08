This node js application uses mysql and Amazon S3. Its main features are 
- User authentication
- Image upload (single and bulk)
- Image reviews (star ratings and verbal reviews)

Bellow you will find a brief description of what should be included in the POST and GET requests made to each endpoint. For examples of how to use each endpoint please see [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f27159d3eaae0e061c2e).


### /auth (POST)
provide “username” (text)
provide ”password” (text)

### /single-upload (POST)
upload a single “image” (file)
provide a “title” (text) and “description” (text)
indicate whether the image is “private” (text, either “T” or”F”)

### /bulk-upload (POST)
upload a list of “image” files
indicate whether the images should be “private” (text, either “T” or”F”)

### /leave-review (POST)
indicate the ”image_id” (Int) of the image to be reviewed
provide a “star_rating” (Int 1-5)
provide a “review” (text)

### /sign-up (POST)
provide “username” (text)
provide ”password” (text)


### /images (GET)
view a list of all images that you have permission to see (public images and private images that belong to you)

### /images/:image_id (GET)
view all of the details about an image

### /see-reviews (GET)
view a list of all the reviews for an image

## How to use
You will need
- node js
- mysql
- AWS S3 
- postman

1. Run the queries found in query.txt
2. Create a bucket in aws S3 and navigate to username dropdown box in the upper right corner ==> “My Security Credentials” ==> “Access keys (access key ID and secret access key)” ==> press the button which says “Create New Access Key”. Save your access key id and secret access key.
3. Run `npm i`
4. Create a .env file filling in each line with your own information
aws_access_key_id =
aws_secret_access_key = 
db_password = 
db_port = 
db_user = 
database = 
db_host =
4. run `node server.js`
5. Explore the application in postman [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/f27159d3eaae0e061c2e)
- Create an account using /sign-in 
- Login using /auth
- Add pictures using /single-upload and /bulk-upload
- Leave a review on an image using /leave-review.
    - you can only leave one review per account for each picture. If you call this endpoint twice for the same account and picture, it will edit your original review
- View a list of all of the images that have been uploaded with /images
- View the details about a particular image with /images/:image_id
    - replace “:image_id” with an actual image_id
