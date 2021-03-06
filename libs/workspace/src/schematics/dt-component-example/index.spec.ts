/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style,
} from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { join } from 'path';
import { addFixtureToTree, getNewFiles } from '../utils/test-utils';

const fixturesFolder = join(__dirname, './fixtures');

describe('Add Example Component', () => {
  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'apps',
    version: '8.0.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'myapp',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: true,
    skipPackageJson: true,
  };

  let initialTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let initialFiles: string[];

  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner(
      '@dynatrace/barista-components/schematics',
      join(__dirname, '../../../collection.json'),
    );

    initialTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions,
        Tree.empty(),
      )
      .toPromise();

    initialTree = await schematicRunner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        initialTree,
      )
      .toPromise();

    initialFiles = initialTree.files;
  });

  it('should add the necessary files', async () => {
    const result = await schematicRunner
      .runSchematicAsync(
        'dt-example',
        { name: 'simple', component: 'TestComponent' },
        initialTree,
      )
      .toPromise();

    const newFiles = getNewFiles(result.files, initialFiles);

    expect(newFiles).toEqual([
      '/libs/examples/src/test-component/index.ts',
      '/libs/examples/src/test-component/test-component-examples.module.ts',
      '/libs/examples/src/test-component/test-component-simple-example/test-component-simple-example.html',
      '/libs/examples/src/test-component/test-component-simple-example/test-component-simple-example.ts',
    ]);
  });

  it('should generate files with the appropriate content', async () => {
    const result = await schematicRunner
      .runSchematicAsync(
        'dt-example',
        { name: 'simple', component: 'TestComponent' },
        initialTree,
      )
      .toPromise();

    const newFiles = getNewFiles(result.files, initialFiles);
    newFiles.map((file) => expect(result.readContent(file)).toMatchSnapshot());
  });

  it('should change files appropriately', async () => {
    await addFixtureToTree(
      initialTree,
      'test-component-examples.module.ts.fixture',
      '/libs/examples/src/test-component/test-component-examples.module.ts',
      fixturesFolder,
    );

    await addFixtureToTree(
      initialTree,
      'index.ts.fixture',
      '/libs/examples/src/test-component/index.ts',
      fixturesFolder,
    );

    const result = await schematicRunner
      .runSchematicAsync(
        'dt-example',
        { name: 'complex', component: 'TestComponent' },
        initialTree,
      )
      .toPromise();

    expect(
      result.readContent(
        '/libs/examples/src/test-component/test-component-examples.module.ts',
      ),
    ).toMatchSnapshot();

    expect(
      result.readContent('/libs/examples/src/test-component/index.ts'),
    ).toMatchSnapshot();
  });
});
