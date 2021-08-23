Rails.application.routes.draw do
  
root to: redirect('/todos')

get 'todos', to: 'site#index'
get 'todos/new', to: 'site#index'
get 'todos/:id/edit', to: 'site#index'
# URLが変更されたとしても、表示するビューは全てsite#indexのアクションを渡すようにしてる。

# 以下がReactの動きをする。
namespace :api do
  namespace :v1 do
    delete '/todos/destroy_all', to: 'todos#destroy_all'
    resources :todos, only: %i[index show create update destroy]
  end
end
# namespaceは、Prefix, URI, actionの全てに
# 先頭で指定したものを入れる。今回で言うと/api/v1 になる。
# %i は、シンボルを配列形式で渡したもの。今回で言うと、[:index, :show, ...etc]
end
