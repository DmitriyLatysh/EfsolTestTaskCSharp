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
            inputType: "text",
            currentQuestion: "",
            inputData: [],
            finished: 0
        };

        this.GetNextQuestionClick = this.GetNextQuestion.bind(this);
        this.GetPrevQuestionClick = this.GetPrevQuestion.bind(this);
        this.Save = this.Save.bind(this);
    }

    AnswersMap = new Map();

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
            if (this.state.data[0].answerType == "radio") {
                this.LoadInputs();
            }
            return;
        }

        this.SaveCurrentData();

        var curQuestionStateIdInQuery = this.state.currentQuestion.idInQuery;
        var nextQuestion = this.state.data.find(el => el.idInQuery > curQuestionStateIdInQuery);
        if (!!nextQuestion) {
            this.setState({ currentQuestion: nextQuestion, inputType: nextQuestion.answerType },
                () => {
                    if (nextQuestion.answerType != "radio") {
                        this.FillPrevAnswer(nextQuestion);
                    }
                }
            );
            if (nextQuestion.answerType == "radio") {
                this.LoadInputs(nextQuestion);
            }
        }
    }

    GetPrevQuestion() {
        this.SaveCurrentData();

        var curQuestionStateIdInQuery = this.state.currentQuestion.idInQuery;
        var prevQuestion = this.state.data.slice().reverse().find(el => el.idInQuery < curQuestionStateIdInQuery);
        if (!!prevQuestion) {
            this.setState({ currentQuestion: prevQuestion, inputType: prevQuestion.answerType },
                () => {
                    if (prevQuestion.answerType != "radio") {
                        this.FillPrevAnswer(prevQuestion);
                    }
                }
            );
            if (prevQuestion.answerType == "radio") {
                this.LoadInputs(prevQuestion);
            }
        }
    }

    LoadInputs(question) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', `/GetInputTypesById?id=${question.id}`);
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            this.setState({ inputData: response },
                () => this.FillPrevAnswer(question, true)
            );
        }.bind(this);
        xhr.send();
    }

    FillPrevAnswer(question, whenloadedinpus = false) {
        var prevAnswer = this.AnswersMap.get(question.id);
        if (question.answerType == "radio" && whenloadedinpus) {
            if (!!prevAnswer)
                document.getElementById(prevAnswer).checked = true;
        }
        else {
            if (!!prevAnswer) {
                if (this.state.inputType != "checkbox")
                    document.getElementById("inputField").value = prevAnswer;
                else
                    document.querySelector('input[type="checkbox"]').checked = prevAnswer;
            }
            else {
                try {
                    document.getElementById("inputField").value = " ";
                }
                catch{
                    return;
                }
            }
        }
    }

    Save() {

        this.SaveCurrentData();

        var result = [];
        this.AnswersMap.forEach((value, key) => {
            var myObj = { idQuestion: key, Result : String(value)};
            result.push(myObj);
        });

        var xhr = new XMLHttpRequest();
        xhr.open("post", "/createanswer");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            if (xhr.status == "200") {
                this.setState({ finished: 1 });
            }
            else {
                this.setState({ finished: 2 });
            }
        }.bind(this);
        xhr.send(JSON.stringify(result));
    }

    SaveCurrentData() {
        if (this.state.inputType == "radio") {
            var elements = document.getElementsByName("radioboys");
            for (var i = 0, len = elements.length; i < len; ++i)
                if (elements[i].checked) {
                    this.AnswersMap.set(this.state.currentQuestion.id, elements[i].value);
                }
        }
        else if (this.state.inputType == "checkbox") {
            var curData = document.querySelector('input[type="checkbox"]').checked;
            this.AnswersMap.set(this.state.currentQuestion.id, curData);
        }
        else {
            var curData = document.getElementById("inputField").value;
            if(curData != "")
                this.AnswersMap.set(this.state.currentQuestion.id, curData);
        }
    }

    render() {
        return (
            <div>
                {this.state.data.length == 0 &&
                    <h1>Загружаем данные...</h1>
                }
                {this.state.finished == 1 &&
                    <h1>Спасибо, что прошли анкету!</h1>
                }
                {this.state.finished == 2 &&
                    <h1>Спасибо, что прошли анкету! Увы, данные не были записаны по техническим причинам</h1>
                }
                {(this.state.data.length > 0 && this.state.currentQuestion != "" && this.state.finished == 0 ) ?
                    <QuestionComponent currentQuestion={this.state.currentQuestion} /> : null}
                {this.state.finished == 0 && this.state.data.length > 0 &&
                    <label> Введите ответ
                    {this.state.inputType == "radio" ? (
                            <div>
                                {this.state.inputData.map(el => {
                                    return <label key={el.possibleInput}> {el.possibleInput} <input value={el.possibleInput} type={this.state.inputType} name="radioboys" id={el.possibleInput} /> </label>
                                })}
                            </div>
                        ) :
                            <input type={this.state.inputType} id="inputField" />
                        }

                </label>
                }
                {this.state.finished == 0 && this.state.data.length > 0 &&
                    <div className="btn-group">
                        {this.state.currentQuestion.idInQuery != 1 ?
                            <button onClick={this.GetPrevQuestionClick} > Предыдущий вопрос</button> : null}
                        {this.state.currentQuestion.idInQuery != this.state.data.length ?
                            <button onClick={this.GetNextQuestionClick}>Следующий вопрос</button> : null}
                    {this.state.currentQuestion.idInQuery == this.state.data.length ?
                            <button onClick={this.Save}>Сохранить данные</button> : null}
                    </div>
                }
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