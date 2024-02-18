# ChatMaps
Main repo for ChatMaps, our COS420 Project.

ChatMaps is a web-based social networking service that allows users to connect to others in their local geographic area. It will implement an interactable mapping utility to show general user locations relative to other users, as well as a chat room feature that allows users to start public conversations based on a specified topic. ChatMaps is primarily intended for use in densely populated areas, such as college campuses or metropolitan areas, so people of similar interests can start conversations. The goal of this project is to create a web app that plots locations, gives a radius of the local area, and connects users into different topic-based chat rooms.

This service will implement user login and profiles, allowing users to add each other as friends and start private conversations. There will be several default chat rooms of varying topics, but users will also have the ability to create their own topics that will be viewable by other users. For example, a user at the University of Maine could create a joinable chat room titled “COS420”, which would be visible to others near this campus.

This app shares some similarities to other social networks that implement location-based content. ChatMaps’ novel approach is to utilize user location to facilitate real-time communication with others within a given radius.

The live version of this app can be found at:

http://chatmaps.nicholaspease.com

A local version can be run with:

cd frontend-next/

npm run dev

then navigating to:

http://localhost:3000

