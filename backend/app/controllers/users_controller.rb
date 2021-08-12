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



    def authorize

        client_id = "0724f13286da41eb90bef57cebcc0202"
        client_secret = "095c882ed46444a5b878e0b99d9dcd28"
        redirect_uri = "http://localhost:3000/save_token"

        credentials = Base64.encode64( client_id + ':' + client_secret)
        credentials["\n"] = ""
         puts(credentials)
        begin
        response = RestClient.post("https://accounts.spotify.com/api/token", 
            {
                :grant_type => "authorization_code",
                :code => params[:code],
                :redirect_uri => "http://localhost:3000/save_token" #, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
            },
            {
                :Authorization => 'Basic ' + credentials

            }
        )

    rescue => err 
        puts err.http_body
    end

    result = JSON.parse(response)

    puts(result)

    redirect_to "http://localhost:3001/playlist/#{result["access_token"]}"

        # client_id = "0724f13286da41eb90bef57cebcc0202";
        # client_secret = "095c882ed46444a5b878e0b99d9dcd28";
        # redirect_uri = encodeURIComponent("http://localhost:3000/save_token");

        #    body = new URLSearchParams();
        # body.append("grant_type", "authorization_code");
        # fetch("https://accounts.spotify.com/api/token", {
        #   method: "POST",
        #   headers: {
        #     Authorization: `Basic #{btoa(`#{client_id}:#{client_secret}`)}`
        #   },
        #   body: body
        #   code: params[:code]
        #   redirect_uri: redirect_uri
        # })

    end




end