import { Config } from "@jest/types"

const baseTestDir = '<rootDir>/__tests__/infra'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        `${baseTestDir}/**/*test.ts`
    ]
}

export default config;
