import { generateI18nMessageKeys } from './static-i18n-message-keys.task';

const preBuildTasks: (() => Promise<void>)[] = [generateI18nMessageKeys];

const runPreBuildTasks = async () => {
  console.log('-------------------------------------');
  for (const task of preBuildTasks) {
    console.log('Run task: ', task.name);
    try {
      await task();
      console.log('-------------------------------------');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
};

console.log('Run pre-build tasks ...');
runPreBuildTasks().then(() => console.log('Pre-build tasks finished'));
