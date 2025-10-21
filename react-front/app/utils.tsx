export interface ContactState {
    uuid: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    active: boolean;
}

export interface ContactViewModel {
    contact: ContactState;
    active: boolean;
    formStatus: FormStatus;
}

export const enum FormStatus {
    Editing = "EDITING",
    Pending = "PENDING",
    Ok = "OK",
    Failed = "FAILED"
}

export const enum ContactBlockActions {
    SetContacts = 'SET_CONTACTS',
    SetLoading = 'SET_LOADING',
    SetAll = 'SET_ALL',
}

export interface ReducerAction {
    type: string;
    payload: any;
}