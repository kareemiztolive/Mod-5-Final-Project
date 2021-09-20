Rails.application.routes.draw do

resources :users

post('/login', { to: 'users#login' })
get('/save_token',{to: 'users#authorize'})





end
