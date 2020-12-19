npm run release
$startPath = (pwd).path
cp -Recurse -Force dist/* ../firebase_random-teammate-picker/src 
cd ../firebase_random-teammate-picker
./deploy.ps1
cd $startPath