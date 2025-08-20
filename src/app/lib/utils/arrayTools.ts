export function removeStringItemFromStringArray(array:Array<string>,item:string){
    const newArray:string[] = [];
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