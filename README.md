# Gbv-support
Go to https://github.com/Matuwamai and navigate to GVB-Support repository.
Click code and copy the repository url.
Open your command prompt and navigate to your desired folder for the project.
Run git clone "the copied url from github"
Once it is done move inside the root folder -cd GVB-support , then open it in your default code editor -code .
Once you are in the code editor now open the terminal and navugate to the user-side folder -cd user-side and run npm install to install all the packages and dependencies.
Then open another terminal and navigate to the server side and also run npm install.
Go to xammp control pannel or any other of such kind and create a database then on the server folder open an env file and paste your databse url like this DATABASE_URL="your database url" 
then JWT_SECRETE like this JWT_SECRET  = ASDFGHJKLMNBBVFDRTYUHJNB VCXDSRTYGHBVCXDSRETYGHBV
then this BASE_URL = http://localhost:3000
 After that go create account on twilio
 and generate an a token and create a phone number
 copy the auth token and the sid and paste it in the .env
 TWILIO_ACCOUNT_SID="your twilio sid"
TWILIO_AUTH_TOKEN="your twilio auth token"
TWILIO_PHONE_NUMBER="your twilio phone number"
so the .env should have the following:
 -DATABASE_URL="your database url" 
 -JWT_SECRET="anything"
 -BASE_URL = http://localhost:3000
 -TWILIO_ACCOUNT_SID="your twilio sid"
 -TWILIO_AUTH_TOKEN="your twilio auth token"
 -TWILIO_PHONE_NUMBER="your twilio phone number"

 Now you can "run npm run start" in your server side and "npm run dev" in your user-side