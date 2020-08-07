// QuestionQueue Class
// Adapted from Queue class: https://www.geeksforgeeks.org/implementation-queue-javascript/
class QuestionQueue {
	constructor(questions) {
        this.questions = [];
        this.userAnswers = [];
        let keys = Object.keys(questions);
        keys.forEach(key => {
            this.questions.push(questions[key]);
            this.userAnswers.push([0,0]); // [answered count, correct count]
        });
        this.middle = Math.floor(keys.length/2)-1;
	}
    enqueue(question, userAnswer, index) {
        // add question/answer pair to queue at given index, or end of queue if index null
        if (index==null){
            this.questions.push(question);
            this.userAnswers.push(userAnswer);
        }else{
            this.questions.splice(index, 0, question);
            this.userAnswers.splice(index, 0, userAnswer);
        }
    }
    dequeue() {
        // remove and return next question/answer pair from front of queue
        if(this.isEmpty()) return "Underflow";
        return {
            'question' : this.questions.shift(),
            'answer' : this.userAnswers.shift()
        };
    }
    front() { 
        // return front element without removing it
        if(this.isEmpty()) return "No elements in Queue"; 
        return this.questions[0]; 
    }
    isEmpty() {
        // return true if the queue is empty
        return this.questions.length == 0; 
    }
    printQueue() { 
        console.log('Question queue:');
        for(var i = 0; i < this.questions.length; i++){
            console.log(i +": '"+this.questions[i].text+"'\n"+this.questions[i].answers[0].text+
            "\n(answered: "+this.userAnswers[i][0]+", correct: "+this.userAnswers[i][1]+")");
        }
    }
}
