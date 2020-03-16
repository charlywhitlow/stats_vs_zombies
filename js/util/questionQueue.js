// QuestionQueue Class
// Adapted from: https://www.geeksforgeeks.org/implementation-queue-javascript/
class QuestionQueue 
{
	constructor(questions) {

        // array used to implement queue 
        this.questions = [];
        
        // create queue from given questions for level
        let questionKeys = Object.keys(questions);
        questionKeys.forEach(key => {
            this.enqueue(questions[key]);            
        });
	}
				
    // enqueue function 
    enqueue(question) {     
        // add element to the queue 
        this.questions.push(question); 
    }

    // dequeue function 
    dequeue() { 
        // removing element from the queue- returns underflow when called on empty queue 
        if(this.isEmpty()) 
            return "Underflow";
        return this.questions.shift(); 
    }

    // front function 
    front() { 
        // returns the Front element of the queue without removing it
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.questions[0]; 
    }

    // isEmpty function 
    isEmpty() { 
        // return true if the queue is empty. 
        return this.questions.length == 0; 
    }

    // printQueue function 
    printQueue() { 
        console.log('Question queue:');
        for(var i = 0; i < this.questions.length; i++){
            console.log(i +": '"+this.questions[i].text+"'");
        }
    }
} 
