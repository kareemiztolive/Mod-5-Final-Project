class UsersController < ApplicationController


   def login
        user = User.find_by(username: params[:username])
        token = JWT.encode( { id: user.id }, 'YOUR SECRET')
        if(user.authenticate(params[:password]))
            render( json: { user: user, token: token } )
        else
            render( json: { failed: true, message: 'Login Failed'}) 
        end
    end 






    def create
        if User.find_by({username: params[:username]})
            render json: {failed: true, message: "Username already taken!"}
        else
            user = User.create(
                username: params[:username],
                password: params[:password]
            )
            render json: {user: user}

        end
    end




end