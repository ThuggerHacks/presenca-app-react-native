let userData;

export const append = (data) => {
    userData= data;
}

export const getData = () => {return userData};

export const removeData = () => { userData = null};