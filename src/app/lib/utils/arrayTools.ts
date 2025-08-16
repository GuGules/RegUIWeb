export function removeItemFromArray(array:Array<any>,item:any){
    var newArray = [];
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