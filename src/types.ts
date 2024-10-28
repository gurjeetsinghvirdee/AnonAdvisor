export interface Questions {
    $id: string;
    questionText: string;
    timestamp: string;
}

export interface Answers {
    $id: string;
    questionID: string;
    answerText: string;
    timestamp: string;
}