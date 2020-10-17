class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showQuestion: false,
            data: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            showQuestion: true
        });
    }

    render() {
        return (
            <div className="text">
                {this.state.showQuestion ?
                    <WrapQuestionComponent /> :
                    <HelloComponent handleClick={this.handleClick} />
                }
            </div>
        );
    }
}

class HelloComponent extends React.Component {
    render() {
        return (
            <div className="text">
                <h1>Добро пожаловать. </h1>
                <h1>Нажмите <q>Начать</q>, чтобы Начать =)</h1>
                <a href="#" onClick={this.props.handleClick} className="button">Начать</a>
            </div>
        );
    }
}

class WrapQuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inputType: "checkbox",
            currentQuestion: ""
        };

        this.GetNextQuestionClick = this.GetNextQuestion.bind(this);
        this.GetPrevQuestionClick = this.GetPrevQuestion.bind(this);
        this.Save = this.Save.bind(this);
        this.OnChangeDataInput = this.OnChangeDataInput.bind(this);
    }

    AnswersMap = new Map();
    arrRad1 = ["1","2"];

    componentDidMount() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/questions');
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            this.setState({ data: response });
            this.GetNextQuestion(true);
        }.bind(this);
        xhr.send();
    }

    GetNextQuestion(firstInvoke = false) {
        if (firstInvoke == true) {
            this.setState({ currentQuestion: this.state.data[0], inputType: this.state.data[0].AnswerType });
            return;
        }

        var curQuestionStateIdInQuery = this.state.currentQuestion.idInQuery;
        var nextQuestion = this.state.data.find(el => el.idInQuery > curQuestionStateIdInQuery);
        if (!!nextQuestion) {
            this.setState({ currentQuestion: nextQuestion, inputType: nextQuestion.answerType });
        }
    }

    GetPrevQuestion() {
        var curQuestionStateIdInQuery = this.state.currentQuestion.idInQuery;
        var prevQuestion = this.state.data.slice().reverse().find(el => el.idInQuery < curQuestionStateIdInQuery);
        if (!!prevQuestion) {
            this.setState({ currentQuestion: prevQuestion, inputType: prevQuestion.answerType });
        }
    }

    Save() {
        this.AnswersMap.forEach((value, key) => {
            console.log(`${key} => ${value}`);
        });
    }

    OnChangeDataInput(evt) {
        if (this.state.inputType == "radio") {
            this.arrRad1.reverse();
            this.AnswersMap.set(this.state.currentQuestion.id, document.querySelector('input[name="radioboys"]:checked').value == "on" ? true : false);
        }
        else {
            this.AnswersMap.set(this.state.currentQuestion.id, evt.target.value);
        }
    }

    render() {
        return (
            <div>
                {(this.state.data.length > 0 && this.state.currentQuestion != "") ?
                    <QuestionComponent currentQuestion={this.state.currentQuestion} /> : null}
                <label> Введите ответ
                {this.state.inputType == "radio" ? (
                        <div>
                            {this.arrRad1.map(el => {
                                return <label key={el +1}> {el} <input onChange={this.OnChangeDataInput} type={this.state.inputType} name="radioboys" key={el} /> </label>   
                            })}
                        </div>
                    ) :
                        <input onChange={this.OnChangeDataInput} type={this.state.inputType} id="inputField" />
                    }

                </label>
                <div className="btn-group">
                    {this.state.currentQuestion.idInQuery != 1 ?
                        <button onClick={this.GetPrevQuestionClick} > Предыдущий вопрос</button> : null}
                    {this.state.currentQuestion.idInQuery != this.state.data.length ?
                        <button onClick={this.GetNextQuestionClick}>Следующий вопрос</button> : null}
                    {this.state.currentQuestion.idInQuery == this.state.data.length ?
                        <button onClick={this.Save}>Сохранить данные</button> : null}
                </div>
            </div>
        );
    }
}

class QuestionComponent extends React.Component {
    render() {
        return (
            <div >
                <h1>{this.props.currentQuestion.textQuestion}</h1>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("content")
);