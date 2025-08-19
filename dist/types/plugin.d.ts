export type BuilderPluginProps<T> = {
    onChange: (value: T) => void;
    value: T;
    context: any;
};
