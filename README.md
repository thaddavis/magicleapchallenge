### MAGIC LEAP CHALLENGE ###

which additional requirements were chosen
------------------------------------
1.) Add user-based access control to your files such that only the user that originally uploaded the file can access it.



how to compile/build/run code locally
------------------------------------
1.) `git clone git@github.com:thaddavis/magicleapchallenge.git` will copy the source code to your directory
2.) `cd magicleapchallenge` will move you into the project 
2.) `npm install` will install all of the project dependencies
3.) `node index.js` will run the app



where to access deployed version of my code
------------------------------------
The app is hosted at: http://challenge-dev.us-east-1.elasticbeanstalk.com

Here are the cURL commands to use the app:

1.) To register a user with the app
curl -d "username=<YOUR_USERNAME_HERE>&password=<YOUR_PASSWORD_HERE>" -X POST http://challenge-dev.us-east-1.elasticbeanstalk.com/api/auth/register

2.) To login to the app
curl -d "username=<YOUR_USERNAME_HERE>&password=<YOUR_PASSWORD_HERE>" -X POST http://challenge-dev.us-east-1.elasticbeanstalk.com/api/auth/login

3.) To upload a file
curl -X POST -H "x-access-token: <YOUR_TOKEN_HERE>" -F "asset=@<PATH_TO_YOUR_FILE>" http://challenge-dev.us-east-1.elasticbeanstalk.com/api/assets -# | tee -a "/dev/null" ; test ${PIPESTATUS[0]} -eq 0

4.) To list all your uploaded files
curl -X GET -H "x-access-token: <YOUR_TOKEN_HERE>" http://challenge-dev.us-east-1.elasticbeanstalk.com/api/assets

5.) To Download a file
curl -X GET -H "x-access-token: <YOUR_TOKEN_HERE>" http://challenge-dev.us-east-1.elasticbeanstalk.com/api/assets/<YOUR_FILE_IDENTIFIER_HERE> -O -J


all design/architectural/technical decisions
------------------------------------
So I saw in the description of the challenge that you use a lot of Javascript and AWS so I 
built a node app hosted through elastic beanstalk. In order to prototype this app in a way that promotes scalability
I used auto-scaling features, JWT authentication, file-upload size limits of 1MB and hosted a mongo database through mLAB (Database as a service). 

You can view the source code at https://github.com/thaddavis/magicleapchallenge

:)



