# Backend
Built on `nodeJS`, `expressJS`, `MongoDB`. <br>
The original project repo, built with JS : [Callbreak-REST-backend](https://github.com/sudbasnet/Callbreak-REST-Backend)

# Frontend
Built with `VueJS` : [Callbreak-Frontend-Vue](https://github.com/sudbasnet/Callbreak-Frontend-Vue)

# Project
In this project, I'm trying to create an online multiplayer application for playing the game of "CALLBREAK". It is a card-game, played with a regular deck of 52 cards. The game should be played with 4 players, however, a modified version can be played with just 3 players.

As far as the project design is concerned, it will have the following parts or functionalities.

### Authentication 
*   Authentication is done with JSON Web Token (JWT)
*   User Actions:
    *   Registration (inc. user verification through email, reset password through email)
    *   Login
    *   Deactvation of account
    *   Deleting account permanently

### Gameplay
* The players should be able to invite other players to join their game.
* If 4 players are not available, player should be able to add bots.

### Communication among players (`socket.io`)
*   The in-game communication (moves made by the players) will also be done using `socket.io`
*   Chatting among the players.

### See game history or playbacks (Future)
* Authenticated players can view their past games.
* Players can also see their stats and games played by other players.

### The complete folder structure is as follows (only shows important files/folders):
(I'm Trying to base it on Clean Coding architecture by Bob Martin, I've designed the project structure in a way that makes sense to me 🙂, feedbacks are welcomed)
```
    |-- [user]
        |-- [use-cases]
            |-- (contains all modules that users have access to)
        |-- user.model.ts (connects to mongoDB collection)
        |-- user.controller.ts ( pulls all the use-cases in one place )
        |-- user.routes.ts
    |-- [game]
        |-- use-cases
            |-- [callbreak]
                |-- (contains callbreak-specific use-cases)
            |-- create.ts
            |-- join.ts
            |-- leave.ts
            |-- pause.ts
        |-- game.model.ts (connects to mongoDB collection)
        |-- game.controller.ts (pulls all the use-cases in one place)
        |-- game.routes.ts
    |-- [_middlewares]
        |-- (all the middlewares/interactors. Only these middlewares can connect different components)
    |-- [_entities]
        |-- (public entities/classes, such as Card, Deck, etc)
    |-- [_helpers]
        |-- (contains simple functions that are repeated inside the program, available to everyone)
    |-- .env (contains secret keys)
    |-- server.js (main file)
```
