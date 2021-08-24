class Api::V1::TodosController < ApplicationController
  def index
    todos = Todo.order(updated_at: :desc)
    render json: todos
    # json形式で配列を渡す。今回でいうと、todosをJSON形式で渡してる。
    
  end

  def show
    todo = Todo.find(params[:id])
    render json: todo
  end

  def create
    todo = Todo.new(todo_params)
    if todo.save
      render json: todo
    else
      render json: todo.errors, status: 422
    end
  end

  def update
    todo = Todo.find(params[:id])
    if todo.update(todo_params)
      render json: todo
    else
      render json: todo.errors, status: 422
    end
  end

  def destroy
    if Todo.destroy(params[:id])
      head :no_content
      # 渡すものはないけど、通信としては成立してることを伝えてる。
    else
      render json: { error: "Failed to destroy" }, status: 422
    end
  end

  def destroy_all
    if Todo.destroy_all
      # テーブルのレコード全てを削除するメソッド、deleteと違って、activeRecordを通して消してる。
      head :no_content
    else
      render json: { error: "Failed to destroy" }, status: 422
    end
  end

  private

  def todo_params
    # ストロングパラメーター
    params.require(:todo).permit(:name, :is_completed)
  end
end