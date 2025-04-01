export function sortedPush<T extends Object>(arr: T[], elem: T, key: keyof T) {
	for (let i = 0; i < arr.length; i++) {
		if(arr[i][key]>elem[key]){
		    arr.splice(i,0,elem);
            return arr;
		}
	}
    arr.push(elem)
	return arr;
}