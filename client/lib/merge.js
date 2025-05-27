export class ObjectMatcher {
  constructor(structuredObject) {
    this.structuredObject = structuredObject;
  }

  match(objects) {
    for (const obj of objects) {
      if (this.isMatch(obj)) {
        return true;
      }
    }
    return false;
  }

  mergeMatching(...arrays) {
    const matchingObjects = [];
    for (const array of arrays) {
      for (const obj of array) {
        if (this.match([obj])) {
          matchingObjects.push(obj);
        }
      }
    }
    return this.recursiveMerge(matchingObjects);
  }

  matchCSV(csvString) {
    const objects = this.csvToObjects(csvString);
    return this.match(objects);
  }

  isMatch(obj) {
    const structuredKeys = Object.keys(this.structuredObject);
    const objKeys = Object.keys(obj);

    if (
      structuredKeys.length !== objKeys.length ||
      !structuredKeys.every((key) => objKeys.includes(key))
    ) {
      return false;
    }

    return structuredKeys.every((key) => {
      const structuredValue = this.structuredObject[key];
      const objValue = obj[key];

      if (typeof structuredValue === "object" && typeof objValue === "object") {
        return this.isMatch(objValue);
      }

      return true;
    });
  }

  recursiveMerge(objects) {
    const mergedObjects = [];

    for (const obj of objects) {
      const mergedObject = {};

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (
            key in mergedObject &&
            typeof mergedObject[key] === "object" &&
            !Array.isArray(mergedObject[key])
          ) {
            mergedObject[key] = this.recursiveMerge(objects.map((o) => o[key]));
          } else {
            mergedObject[key] = obj[key];
          }
        }
      }
      mergedObjects.push(mergedObject);
    }

    return mergedObjects;
  }

  csvToObjects(csvString) {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    const objects = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj = {};
      values.forEach((value, index) => {
        obj[headers[index]] = this.parseValue(value.trim());
      });
      objects.push(obj);
    }

    return objects;
  }

  parseValue(value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return numValue;
    }

    if (value.toLowerCase() === "true") {
      return true;
    } else if (value.toLowerCase() === "false") {
      return false;
    }

    const dateMatch = value.match(/^\d{4}-\d{2}-\d{2}$/);
    if (dateMatch) {
      return new Date(value);
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(error);
      return value;
    }
  }
}
