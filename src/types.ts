export interface Questions {
    $id: string;
    questionText: string;
    timestamp: string;
    userID: string;
}

export interface Answers {
    $id: string;
    questionID: string;
    answerText: string;
    timestamp: string;
    parentID?: string;
    userID: string;
}