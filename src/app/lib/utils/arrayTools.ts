export function removeItemFromArray(array:Array<unknown>,item:unknown){
    const newArray = [];
    if (array.includes(item)){
        for (const arrayItem of array){
            if (arrayItem !== item){
                newArray.push(arrayItem)
            }
        } return newArray;
    } else {
        return array;
    }
}