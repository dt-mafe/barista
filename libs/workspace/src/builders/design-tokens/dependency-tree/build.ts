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

import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { writeFileSync, mkdirSync } from 'fs';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, switchMap, tap } from 'rxjs/operators';
import { DesignTokensDependencyTreeOptions } from './schema';
import { DependencyGraph } from './dependency-graph';
import { addTokensToAliasDependenciesToGraph } from './add-tokens-to-alias-dependencies';
import { processComponentsDependencies } from './add-component-dependencies';
import { join } from 'path';

/**
 * Package builder for design tokens. Runs the build for the design tokens
 * and packages the files to the output directory.
 */
export function designTokensDependencyTreeBuilder(
  options: DesignTokensDependencyTreeOptions,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return of(new DependencyGraph()).pipe(
    // Add token files to alias dependencies to the graph.
    switchMap((dependencyGraph) =>
      addTokensToAliasDependenciesToGraph(dependencyGraph, context, options),
    ),
    switchMap((dependencyGraph) =>
      processComponentsDependencies(dependencyGraph, context, options),
    ),
    tap(() => {
      // Ensure the output directory is there
      mkdirSync(options.outputPath, { recursive: true });
    }),
    tap((dependencyGraph) =>
      writeFileSync(
        join(options.outputPath, 'dependencytree.json'),
        dependencyGraph.serialize(),
      ),
    ),
    tap((dependencyGraph) =>
      writeFileSync(
        join(options.outputPath, 'dependencytree.dot'),
        dependencyGraph.convertToDotGraph(),
      ),
    ),
    mapTo({ success: true }),
    catchError((error: Error) => {
      context.logger.error(error.stack!);
      return of({
        success: false,
      });
    }),
  );
}
