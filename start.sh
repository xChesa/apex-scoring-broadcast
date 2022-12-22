# echo Enter private match API endpoint: 
# read endpoint
cd frontend
# npm install
# npm run build
rm -rf ../server/dist
mv ./dist ../server/

cd ../server
npm install

echo "Done installing, Building.."

cd ..
docker build . -t stats-server

