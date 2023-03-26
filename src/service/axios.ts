

export const axios = {
     get<T>(url:string,authorization?:string):Promise<T>{
     return new Promise<T>((resolve,reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const result: T = JSON.parse(xhr.response);
                if (!result) {
                    ///TODO:
                    reject(xhr.response);
                    return;
                }
                resolve(result);
            } else if (xhr.readyState === 4 && xhr.status != 200) {
                console.log('失败：', xhr.response);
                reject(xhr.response);
            }
        }
        if(authorization){
            xhr.setRequestHeader('Authorization', authorization);
        }
        xhr.send(null)
     });
    }
}