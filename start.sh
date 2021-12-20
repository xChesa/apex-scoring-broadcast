echo Enter private match API endpoint: 
read endpoint
cd frontend
npm install
npm run build
mv -r ./dist ../server/

cd ../server
npm install
clear
node index.js %endpoint%
