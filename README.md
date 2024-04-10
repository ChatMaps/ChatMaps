![](/frontend-next/public/logos/logo_transparent.png)
Main repo for ChatMaps, our COS420 Project.

ChatMaps is a web-based social networking service that allows users to connect to others in their local geographic area. It implements an interactable mapping utility to show general user locations relative to others, as well as a chat room feature that allows users to start public conversations based on any given topic. ChatMaps is primarily intended for use in densely populated areas, such as college campuses or metropolitan areas, so people of similar interests can start new conversations. The goal of this project is to create a web app that plots locations, gives a radius of the local area, and connects users into different topic-based chat rooms.

This service implements user login and profiles, allowing users to add each other as friends and start private conversations. There are several default chat rooms of varying topics, but users also have the ability to create their own rooms that will be visible to other users. For example, a user at the University of Maine could create a joinable chat room titled “COS420”, which would be joinable by others near this campus.

This app shares some similarities to other social networks that implement location-based content. ChatMaps’ novel approach is to utilize user location to facilitate real-time communication with others within a given radius.

The live version of this app can be found at:

https://chatma.ps/

A local version can be run (assuming you have Node installed) with:

cd frontend-next/

npm install

npm run dev

then navigating to:

http://localhost:3000

