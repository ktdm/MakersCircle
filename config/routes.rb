MakersCircle::Application.routes.draw do

  root 'home#index'
  post 'login', to: 'home#login'
  get 'logout', to: 'home#logout'
  get 'ping', to: 'home#ping'

  resources :users, except: [:edit, :destroy]
  resources :posts, except: [:new, :edit]
  resources :comments, except: [:new, :edit]
  resources :events, except: [:new, :edit]

end
