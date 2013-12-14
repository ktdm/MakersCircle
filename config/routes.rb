MakersCircle::Application.routes.draw do

  root 'home#index'
  post 'login', to: 'home#login'
  get 'logout', to: 'home#logout'
  get 'ping', to: 'home#ping'

  resources :users, only: [:new, :create, :show]
  resources :posts, only: [:index, :new, :create, :show]
  resources :comments, only: [:new, :create, :show]
  resources :events, only: [:new, :create, :show, :update]

end
