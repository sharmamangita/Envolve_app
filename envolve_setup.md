
/*REACT NATIVE AND ENVOLVE APP SETUP*/


ENVIRONMENT:
install jdk8 , install python, node,npm if you dont have as per docs https://reactnative.dev/docs/environment-setup
add environment variables path for python jdk etc in path(edit path variable and copy paste path there)
install android studio
after android studion installation > configure sdk, select android version to current and select sdk tools as per reactsetup page documentation.
setup environment variable, ANDROID_HOME = sdk path
also add platfoorm tool and tools path in "Path" variable by editing it.


ANDROID STUDIO CONFIGURE AND INSTALL:
>open android studio when installation finishes, and go to config> sdk manager> there make sure current android versions are selected as per react native setup environment page docs,
once finished, it wll download selected android images and tools required.
>Then we can setup an android device to test projects on by selecting from adv manger in android studio
>you can change memory allocated for android studio device easily to increase performace (read google doc)


ENVOLVE APP SETUP: 
make sure cli is installed globally or installl by command " npm install -g react-native-cli"
>git clone files from git repository..
>go to the project root directory in terminal "/envolve_app"  and there run "npm install"
IN CASE WE WANT TO USE COMMAND terminal ONLY TO BUILD AND RUN PROJECT THEN USE THIS COMMAND after installing node module......
>"react-native run-android"   //this command will build and run project


NOTE: if app runs successfully or in case your changes are not updating in app , you will need to run this command each time before sending apk to test 
>"react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res"


POTENTIAL PROBLEMS WITH BUILD AND INSTALL AND SOLUTIONS:---------
>gradele issue: open android emulator and open the project by selecting project android directory and the navigate to " file>project structure> set "android gradle plugin version =3.5.3 and  set gradle version =6.4
>if run app> build fails then delete signing-config.json file at android\app\build\intermediates\signing_config\debug\out\
then navigate to build > click on "clean project" .
>once build is done then run app in emulator , it should work.
> make sure to check  the file /envolve_app/android/local.properties,  and make sure the sdk dir is correct if its gives path error then set path as "sdk.dir=C\:\\Users\\Ravi\\AppData\\Local\\Android\\Sdk" (where Ravi is user name on your machine).
>if running app gives this error "Failure calling service package: Broken pipe (32)", Then go to adv manager in android studio and delete current adv device and create new adv device.(pixel 2 for example).
>In case white screen appears when opening project you can also try deleting node modules and installing  them again by "npm install"

solve the CarouselScreen bug by giving useScrollView={true}




