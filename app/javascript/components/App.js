import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";
import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import EditTodo from "./EditTodo";
import "./App.css";

const Nabvar = styled.nav`
	background: #dbfffe;
	min-height: 8vh;
	display: flex;
	justify-content: space-around;
	align-items: center;
`;

const Logo = styled.div`
	font-weight: bold;
	font-size: 23px;
	letter-spacing: 3px;
`;

const NavItems = styled.ul`
	display: flex;
	width: 400px;
	max-width: 40%;
	justify-content: space-around;
	list-style: none;
`;

const NavItem = styled.li`
	font-size: 19px;
	font-weight: bold;
	opacity: 0.7;
	&:hover {
		opacity: 1;
	}
`;

const Wrapper = styled.div`
	width: 700px;
	max-width: 85%;
	margin: 20px auto;
`;

function App() {
	return (
		<>
			<Nabvar>
				<Logo>TODO</Logo>
				<NavItems>
					<NavItem>
						<Link to="/todos">Todos</Link>
						{/* クリックすると画面遷移せずにURLだけ追加される。
                URLがどうなったとしても、呼ばれるアクションはsite/index */}
					</NavItem>
					<NavItem>
						<Link to="/todos/new">Add New Todo</Link>
					</NavItem>
				</NavItems>
			</Nabvar>

			<Wrapper>
				<Switch>
					<Route exact path="/todos" component={TodoList} />
					<Route exact path="/todos/new" component={AddTodo} />
					<Route path="/todos/:id/edit" component={EditTodo} />
					{/* pathが以下になった時に、呼び出すコンポーネントを選択してる。 */}
					{/* component={}で渡すときは、階層が一つだけ深い時は、useHistory, 
              useRouteMatchは、記述なしでも使うことができる。 */}
				</Switch>
			</Wrapper>
		</>
	);
}

export default App;
