const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const Generator = require('../lib/generator')

module.exports = async function (name, options) {
    // 执行创建命令

    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name)

    // 目录是否已经存在？
    if (fs.existsSync(targetAir)) {
        console.log('该文件夹已存在（The folder already exists）');
        // 是否为强制创建？
        if (options.force) {
            await fs.remove(targetAir)
        } else {
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: '该文件夹已存在，是否：(Target directory already exists Pick an action:)',
                    choices: [
                        {
                            name: '覆盖（Overwrite）',
                            value: 'overwrite'
                        }, {
                            name: '取消（Cancel）',
                            value: false
                        }
                    ]
                }
            ])

            if (!action) {
                return;
            } else if (action === 'overwrite') {
                // 移除已存在的目录
                console.log(`\r\nRemoving...`)
                await fs.remove(targetAir)
            }
        }
    }
    // 创建项目
    const generator = new Generator(name, targetAir);
    // 开始创建项目
    generator.create()
}