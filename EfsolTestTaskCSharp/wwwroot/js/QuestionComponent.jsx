export default class QuestionComponent extends React.Component {
    render() {
        return (
            <div class="text">
                <h1>И ТАК ВАШ ВОПРОС</h1>
            </div>
        );
    }
}

ReactDOM.render(
    <QuestionComponent />,
    document.getElementById("content")
);