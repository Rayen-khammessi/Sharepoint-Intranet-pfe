export const searchInSharePointList= (list, keyword)=> {
    if (!Array.isArray(list) || typeof keyword !== "string") return [];
  
    const lowerKeyword = keyword.toLowerCase();
  
    return list.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(lowerKeyword)
      )
    );
  }
  