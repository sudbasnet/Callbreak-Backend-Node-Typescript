interface IRepository<T> {
    create(entity: {}): Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(query: any): Promise<T | null>;
    find(query: any): Promise<T[]>;
    deleteOne(query: any): {};
    all(): Promise<T[]>;
    save(entity: T): Promise<T>;
}