MakersCircle::Application.routes.draw do

  root 'home#index'
  post 'login', to: 'home#login'
  get 'logout', to: 'home#logout'
  get 'ping', to: 'home#ping'

  resources :users, only: [:new, :create, :show]
  resources :posts, except: :edit
  resources :comments, except: [:index, :edit]
  resources :events, except: [:index, :edit]

end
