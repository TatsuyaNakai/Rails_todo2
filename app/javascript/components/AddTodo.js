import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend } from "react-icons/fi";

const InputAndButton = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
`;

const InputName = styled.input`
	font-size: 20px;
	width: 100%;
	height: 40px;
	padding: 2px 7px;
`;

const Button = styled.button`
	font-size: 20px;
	border: none;
	border-radius: 3px;
	margin-left: 10px;
	padding: 2px 10px;
	background: #1e90ff;
	color: #fff;
	text-align: center;
	cursor: pointer;
	${({ disabled }) =>
		disabled &&
		`
    opacity: 0.5;
    cursor: default;
  `}
`;
// これも、trueであれば、以下を実行する。falseなら、途中で止まる形になる。

const Icon = styled.span`
	display: flex;
	align-items: center;
	margin: 0 7px;
`;

toast.configure();

function AddTodo(props) {
	const initialTodoState = {
		id: null,
		name: "",
		is_completed: false,
	};
	const [todo, setTodo] = useState(initialTodoState);
	// idはdbに入るタイミングで強制的に決まるから、今は設定しなくていい。

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		//ここのnameは、e.target.nameのこと、inputのname属性で決まる。
		setTodo({ ...todo, [name]: value });
		// ブラケット記法でキーを宣言してあげる必要がある。
		//展開して、後ろから同じキーで新しい値を入れると、上書きされる。
		// 今回でいうと、name:valueが上書きされる。
	};

	const notify = () => {
		toast.success("Todo successfully created!", {
			position: "bottom-center",
			hideProgressBar: true,
		});
		// 第一引数には表示させたい文字列、第二引数には設定をかける。
	};

	const saveTodo = () => {
		let hoge = {
			name: todo.name,
		};
		axios
			.post("/api/v1/todos", hoge)
			// dbに保存する時にidが自動的に決まる。
			// is_completedは何も記載がなかったら、falseになる。
			// その造替のやつが返ってくる。
			.then((res) => {
				setTodo({
					id: res.data.id,
					name: res.data.name,
					is_completed: res.data.is_completed,
				});
				notify();
				props.history.push("/todos");
			})
			.catch((e) => {
				console.log(e);
			});
	};

	return (
		<>
			<h1>New Todo</h1>
			<InputAndButton>
				<InputName
					type="text"
					required
					value={todo.name}
					name="name"
					onChange={handleInputChange}
				/>
				<Button
					onClick={saveTodo}
					disabled={!todo.name || /^\s*$/.test(todo.name)}
					// ||やから、どっちかがtrueなら、disbaleがtrue になる。=>無効化する。
					// 左辺は、nameがfalse（null、全て空白）じゃない限りfalseの状態
					// 右辺は、正規表現で、nameの先頭が空白だとtestで適合するからtrueを返す。
					// =>　何か文字が入力されてさえいればdisabledはfalseで有効になる。
				>
					<Icon>
						<FiSend />
					</Icon>
				</Button>
			</InputAndButton>
		</>
	);
}

export default AddTodo;
