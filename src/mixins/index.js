export const mixin = {
    methods: {
        //提示信息
        notify(title, type) {
            this.$notify({
                title,
                type
            })
        },
        
        //根据相对路径获取绝对路径
        getUrl(url) {
            return `${this.$store.state.HOST}/${url}`;
        },
        //获取性别的中文
        changeSex(sex) {
            if (sex == 0) {
                return '女';
            }
            return '男';
        },
        //截取生日的日期部分
        formatBirth(date) {
            return String(date).substr(0, 10);
        },

        //获取所在地区
        getLocation(province, city, district) {
            return province + ' ' + city + ' ' + district;
        },

        //获取景区地址
        getScenery(province, city, district, scenery) {
            return province + ' ' + city + ' ' + district + ' ' + scenery;
        },

        //头像上传前的校验
        beforeAvatarUpload(file) {
            const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif');
            if (!isJPG) {
                this.$message.error('上传的头像只能是JPG、PNG、GIF格式的');
                return false;
            }
            const isLt2M = (file.size / 1024 / 1024) < 5;
            if (!isLt2M) {
                this.$message.error('上传的头像大小不能超过5M');
                return false;
            }
            return true;
        },

        //头像上传成功之后刷新页面，提示信息
        handleAvatarSuccess(res, file) {
            let _this = this;
            if (res.code === 1) {
                _this.getData();
                _this.notify('头像上传成功', 'success');
            } else {
                _this.notify('头像上传失败', 'error');
            }
        },
        //图片/视频上传前的校验
        beforePicUpload(file) {
            const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif');
            const isMP4 = (file.type === 'audio/mp4') || (file.type === 'video/mp4');
            if (!isJPG && !isMP4) {
                this.$message.error('上传的文件只能是JPG、PNG、GIF、MP4格式的');
                return false;
            }
            const isLt5M = (file.size / 1024 / 1024) < 5;
            const isLt20M = (file.size / 1024 / 1024) < 20;
            if (!isLt5M && isJPG) {
                this.$message.error('上传的图片大小不能超过5M');
                return false;
            } else if (!isLt20M && isMP4) {
                this.$message.error('上传的视频大小不能超过20M');
                return false;
            }
            return true;
        },

        //图片/视频上传成功之后刷新页面，提示信息
        handlePicSuccess(res, file) {
            let _this = this;
            if (res.code === 1) {
                _this.notify('动态上传成功', 'success');
                _this.$router.go(0);
            } else {
                _this.notify('动态上传失败', 'error');
            }
        },
        //弹出删除窗口 
        handleDelete(id) {
            this.index = id;
            this.delVisible = true;
        },

        //将已经选择的赋值给
        handleSelectionChange(value) {
            this.multipleSelection = value;
        },



    }
}