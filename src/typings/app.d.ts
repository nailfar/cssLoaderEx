/**
 * 应用中常用的类型的声明
 * Created by Qingger Corp.
 * User: jsspf
 * Date: 2017/11/16
 * Time: 15:08
 */

/** 对一些常用类型的声明 */
type ItemObject = Object;
type ItemObjectArray = Array<ItemObject>;
type NumberArray = Array<number>;
type StringArray = Array<string>;
type ItemArray<T = any> = Array<T>;

type Name = string;
type Age = number;

type ResURL = string;

// 函数原型，此函数返回Promise
type FnReturnPromise<T = any> = (...args) => Promise<T>;

type NetworkType = "2g" | "3g" | "4g" | "wifi";

// type ResolverFunction = () => string;
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
};

/*declare interface ItemObject extends Object {
    [key: string] : any
}*/

interface DateConstructor {
  /**
   * Date.parse参数可以为Date类型
   * @param {Date} date
   * @return {number}
   */
  parse(date: Date): number;
}

type MaterialType = "image" | "audio" | "video" | "file" | "news";
