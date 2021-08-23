Rails.application.routes.draw do

resources :users

post('/login', { to: 'users#login' })
get('/save_token',{to: 'users#authorize'})

# get('/save_tokendeluxe',{to: 'users#authorizedeluxe'})




end
